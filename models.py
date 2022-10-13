import os

from sqlalchemy import (
    Boolean,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    create_engine,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Constituent(Base):
    __tablename__ = "constituent"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(), unique=True)

    def __repr__(self) -> str:
        return f"Constituent(id={self.id!r}, name={self.name!r})"

    def to_json(self) -> dict:
        return {"id": self.id, "name": self.name}


class Voter(Base):
    __tablename__ = "voter"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(), unique=True)

    def __repr__(self) -> str:
        return f"Voter(id={self.id!r}, name={self.name!r})"

    def to_json(self) -> dict:
        return {"id": self.id, "name": self.name}


class Vote(Base):
    __tablename__ = "vote"
    id: Mapped[int] = mapped_column(primary_key=True)
    voter_id: Mapped[int] = mapped_column(ForeignKey("voter.id"))
    constituent_id: Mapped[int] = mapped_column(ForeignKey("constituent.id"))
    honest: Mapped[bool] = mapped_column(Boolean(), default=False)
    rank: Mapped[int] = mapped_column(Integer())
    UniqueConstraint(voter_id, rank)


# Connect to your postgres DB
engine = create_engine(
    os.environ["RAILWAY_POSTGRESQL_URI"],
    echo=True,
)
