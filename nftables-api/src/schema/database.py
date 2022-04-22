from dotenv import load_dotenv
import sqlalchemy as sa
from sqlalchemy.schema import UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base, DeclarativeMeta
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
import os
import json


Base = declarative_base()


class AlchemyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            # an SQLAlchemy class
            fields = {}
            for field in [
                x for x in dir(obj) if not x.startswith("_") and x != "metadata"
            ]:
                data = obj.__getattribute__(field)
                try:
                    # this will fail on non-encodable values, like other classes
                    json.dumps(data)
                    fields[field] = data
                except TypeError:
                    fields[field] = None
            # a json-encodable dict
            return fields

        return json.JSONEncoder.default(self, obj)


class Table(Base):
    __tablename__ = "tables"
    id = sa.Column(sa.Integer, primary_key=True)
    family = sa.Column(sa.String(255), default="ip", nullable=False)
    name = sa.Column(sa.String(255), nullable=False)
    handle = sa.Column(sa.Integer)

    chains = relationship("Chain", back_populates="table")

    __table_args__ = (UniqueConstraint(
        "family", "name", name="_customer_table_uc"),)

    def __repr__(self):
        return "<Table {self.family} {self.name}>".format(self=self)


class Chain(Base):
    __tablename__ = "chains"
    id = sa.Column(sa.Integer, primary_key=True)
    name = sa.Column(sa.String(255), nullable=False)
    # handle = sa.Column(sa.Integer)
    type = sa.Column(
        sa.String(255),
        nullable=False,
        default="filter",
    )
    hook = sa.Column(sa.String(255), nullable=False)
    priority = sa.Column(sa.Integer, default=0)
    policy = sa.Column(sa.String(255), default="accept")
    table_id = sa.Column(sa.Integer, sa.ForeignKey(
        "tables.id", ondelete="CASCADE"))
    table = relationship("Table", back_populates="chains")
    rules = relationship("Rule", back_populates="chain")

    __table_args__ = (
        UniqueConstraint("name", "type", "hook", "table_id",
                         name="_customer_chain_uc"),
    )

    def __repr__(self):
        return "<Chain(name={self.name!r})>".format(self=self)


class IpDst(Base):
    __tablename__ = "ip_dst"
    id = sa.Column(sa.Integer, primary_key=True)
    host = sa.Column(sa.String(255))
    port = sa.Column(sa.String(255))
    rule_id = sa.Column(sa.Integer, sa.ForeignKey(
        "rules.id", ondelete="CASCADE"))
    rule = relationship("Rule", back_populates="ip_dst_list")

    def __repr__(self):
        return "<IpDest(host={self.host!r})>".format(self=self)


class IpSrc(Base):
    __tablename__ = "ip_src"
    id = sa.Column(sa.Integer, primary_key=True)
    host = sa.Column(sa.String(255))
    port = sa.Column(sa.String(255))
    rule_id = sa.Column(sa.Integer, sa.ForeignKey(
        "rules.id", ondelete="CASCADE"))
    rule = relationship("Rule", back_populates="ip_src_list")

    def __repr__(self):
        return "<IpSource(host={self.host!r})>".format(self=self)


class Rule(Base):
    __tablename__ = "rules"
    id = sa.Column(sa.Integer, primary_key=True)
    protocol = sa.Column(sa.String(255))
    policy = sa.Column(sa.String(255))
    chain_id = sa.Column(sa.Integer, sa.ForeignKey(
        "chains.id", ondelete="CASCADE"))
    chain = relationship("Chain", back_populates="rules")
    ip_src_list = relationship("IpSrc", back_populates="rule")
    ip_dst_list = relationship("IpDst", back_populates="rule")

    def __repr__(self):
        return "<Rule(policy={self.policy!r})>".format(self=self)


load_dotenv()
SQLALCHEMY_DB_URI = os.environ.get("SQLALCHEMY_DB_URI")
engine = sa.create_engine(SQLALCHEMY_DB_URI)
session = scoped_session(sessionmaker(bind=engine))
Base.metadata.create_all(engine)
