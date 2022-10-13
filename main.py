import http
from typing import List

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
    return list(map(lambda c: c.to_json(), constituents))


app.mount("/", StaticFiles(directory="static", html=True), name="static")
