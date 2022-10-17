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
    constituentId: int
    rank: Optional[int]


class VoteRequest(BaseModel):
    votername: str
    honest: bool = False
    rankings: List[Rank]


@app.put("/vote")
async def put_vote(req: VoteRequest):
    session = Session(engine)
    voter = session.scalars(
        select(Voter).filter_by(name=req.votername).limit(1)
    ).one_or_none()
    if not voter:
        voter = Voter(name=req.votername)
        session.add(voter)
        session.commit()
    rankings = {}
    for rank in req.rankings:
        if not rank.rank:
            continue
        rankings[rank.constituentId] = rank.rank
    existing_votes = list(
        session.scalars(
            select(Vote)
            .filter_by(voter_id=voter.id)
            .filter(Vote.constituent_id.in_(list(rankings.keys())))
        )
    )
    updated_votes = []
    for vote in existing_votes:
        if vote.constituent_id in rankings:
            vote.rank = rankings[vote.constituent_id]
            updated_votes.append(vote)
            del rankings[vote.constituent_id]
    session.bulk_save_objects(updated_votes, update_changed_only=True)
    for constituent_id in rankings:
        session.add(
            Vote(
                voter_id=voter.id,
                constituent_id=constituent_id,
                honest=req.honest,
                rank=rankings[constituent_id],
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

    ben_chili = {}
    for i, constituent in enumerate(constituents):
        if constituent["name"] == "Doc Greve's Death Chili":
            ben_chili = constituents.pop(i)
            break
    shuffle(constituents)
    # We have to make sure that Ben's chilli is always first
    if ben_chili:
        constituents.insert(0, ben_chili)
    return constituents


@app.get("/vote/result")
async def get_vote_result(honest: Optional[bool] = None):
    session = Session(engine)

    constituents = list(session.scalars(select(Constituent)))
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
        for my_index, my_id in enumerate(constituent_ids):
            my_ranking = rankings.get(my_id)
            for comp_index, comp_id in enumerate(constituent_ids):
                comp_ranking = rankings.get(comp_id)
                if my_index != comp_index and my_ranking:
                    if not comp_ranking or my_ranking < comp_ranking:
                        result_matrix[my_index][comp_index] += 1
                    elif my_ranking == comp_ranking:
                        result_matrix[my_index][comp_index] += 0.5

    results = []
    for index, score in enumerate(result_matrix):
        const_result = constituents[index].to_json()
        const_result["score"] = sum(score)
        results.append(const_result)

    return sorted(results, key=lambda r: r["score"], reverse=True)


app.mount("/", StaticFiles(directory="static", html=True), name="static")
