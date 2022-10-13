import http
from random import shuffle
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Constituent, Vote, Voter, engine

app = FastAPI()


class Rank(BaseModel):
    constituent_id: int
    rank: int


class VoteRequest(BaseModel):
    voter_name: str
    rankings: List[Rank]
    honest: bool = False


@app.put("/vote")
async def put_vote(req: VoteRequest):
    session = Session(engine)
    voter = session.scalars(
        select(Voter).filter_by(name=req.voter_name).limit(1)
    ).one_or_none()
    if not voter:
        voter = Voter(name=req.voter_name)
        session.add(voter)
        session.commit()
    rankings = {}
    check_rankings = {}
    for rank in req.rankings:
        if rank.rank in check_rankings:
            return HTTPException(
                status_code=http.HTTPStatus.BAD_REQUEST,
                detail=f"Ranked both {rank.constituent_id} "
                f"and {check_rankings[rank.rank]} number {rank.rank}",
            )
        check_rankings[rank.rank] = rank.constituent_id
        rankings[rank.constituent_id] = rank.rank
    constituents = session.scalars(
        select(Constituent).filter(Constituent.id.in_(list(rankings.keys())))
    )
    for constituent in constituents:
        session.add(
            Vote(
                voter_id=voter.id,
                contituent_id=constituent.id,
                honest=req.honest,
                rank=rankings[constituent.id],
            )
        )
    session.commit()
    return rankings


@app.get("/constituents")
async def get_constituents():
    session = Session(engine)
    filter = select(Constituent)
    constituents = session.scalars(filter)
    constituents = list(map(lambda c: c.to_json(), constituents))
    shuffle(constituents)
    return constituents


@app.get("/vote/result")
async def get_vote_result(honest: Optional[bool] = None):
    session = Session(engine)

    constituents = session.scalars(select(Constituent))
    constituent_ids = list(map(lambda c: c.id, constituents))

    vote_query = select(Vote)
    if honest:
        vote_query = vote_query.filter_by(honest=honest)
    votes = session.scalars(vote_query)
    voter_rankings = {}
    for vote in votes:
        if vote.voter_id not in voter_rankings:
            voter_rankings[vote.voter_id] = {}
        voter_rankings[vote.voter_id][vote.constituent_id] = vote.rank

    result_matrix = [
        [0 for _ in range(len(constituent_ids))] for _ in range(len(constituent_ids))
    ]

    for rankings in voter_rankings.values():
        for contituent_id in rankings:
            for competitor_id in rankings:
                if competitor_id != contituent_id:
                    my_id = constituent_ids.index(contituent_id)
                    comp_id = constituent_ids.index(competitor_id)
                    if rankings[my_id] < rankings[comp_id]:
                        result_matrix[my_id][comp_id] = 1
                    elif rankings[my_id] == rankings[comp_id]:
                        result_matrix[my_id][comp_id] = 0.5

    results = []
    for index, score in enumerate(result_matrix):
        const_result = constituents[index].to_json()
        const_result["score"] = score
        results.append(const_result)

    return sorted(results, key=lambda r: r["score"], reverse=True)


app.mount("/", StaticFiles(directory="static", html=True), name="static")
