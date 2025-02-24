from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.types import DECIMAL
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True)

    products = relationship('Product', back_populates='category')

class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_code = Column(Integer, unique=True, index=True)  # Unique product code
    description = Column(String)
    unit_price = Column(DECIMAL)
    category_id = Column(Integer, ForeignKey("categories.id"))

    category = relationship('Category', back_populates='products')