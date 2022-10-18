from sqlalchemy.orm import Session

from models import Constituent, engine


def reset_constituents(engine):
    session = Session(engine)
    session.add(Constituent(id=1, name="Taylor Burdette"))
    session.add(Constituent(id=2, name="Ashley Robertson"))
    session.add(Constituent(id=3, name="Sara Laudeman"))
    session.add(Constituent(id=4, name="Ed Akins"))
    session.add(Constituent(id=5, name="Erin Wrobel"))
    session.add(Constituent(id=6, name="Akshay Padwal"))
    session.commit()


reset_constituents(engine)
