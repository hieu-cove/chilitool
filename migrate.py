from models import Base, engine

Base.metadata.create_all(engine)
# Vote.metadata.drop_all(engine)
