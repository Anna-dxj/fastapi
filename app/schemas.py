from pydantic import BaseModel 
from typing import List, Optional

class ProductBase(BaseModel): 
    product_code: int
    description: str
    unit_price: float
    category_id: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    product_code: Optional[int]=None
    description: Optional[str]=None
    unit_price: Optional[float]=None
    category_id: Optional[int]=None


class Product(ProductBase):
    id: int

    class Config:
        from_attributes=True

class CategoryBase(BaseModel): 
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    products: List[Product] = []

    class Config:
        from_attributes = True 