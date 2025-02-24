from sqlalchemy import Table, Column, Integer, String, ForeignKey
from sqlalchemy.types import DECIMAL
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

category_product_association = Table(
    'category_product',
    Base.metadata,
    Column('category_id', Integer, ForeignKey('categories.id'), primary_key=True),
    Column('product_id', Integer, ForeignKey('products.id'), primary_key=True)
)

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True)

    products = relationship('Product', secondary=category_product_association, back_populates='categories')

class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_code = Column(Integer, unique=True, index=True)  # Unique product code
    description = Column(String)
    unit_price = Column(DECIMAL)

    categories = relationship('Category', secondary=category_product_association, back_populates='products')