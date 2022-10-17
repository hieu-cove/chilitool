from sqlalchemy.orm import Session

from models import Constituent, engine


def add_constituents(engine):
    session = Session(engine)
    session.add(Constituent(name="Erin Wrobel"))
    session.add(Constituent(name="Noah Teuscher"))
    session.add(Constituent(name="Krystl Black"))
    session.add(Constituent(name="Ed Akins"))
    session.add(Constituent(name="Sara Laudeman"))
    session.add(Constituent(name="Taylor Burdette"))
    session.add(Constituent(name="Ashley Robertson"))
    session.add(Constituent(name="Shawn Johnson"))
    session.commit()


add_constituents(engine)
