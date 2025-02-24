from pydantic import BaseModel, Field
from typing import List, Optional

class ProductBase(BaseModel): 
    product_code: int
    description: str
    unit_price: float

class ProductCreate(ProductBase):
    category_ids: List[int]

class ProductUpdate(BaseModel):
    product_code: Optional[int]=None
    description: Optional[str]=None
    unit_price: Optional[float]=None
    category_ids: Optional[List[int]]=None


class Product(ProductBase):
    id: int
    categories: List['CategorySummary'] = []

    class Config:
        from_attributes=True

class ProductSummary(ProductBase):
    id: int

    class Config: 
        from_attrubutes = True 

class CategoryBase(BaseModel): 
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: str = Field(min_length=1)

class CategorySummary(CategoryBase):
    id: int

    class Config:
        from_attributes = True 

class Category(CategoryBase):
    id: int
    products: List[ProductSummary] = []

    class Config:
        from_attributes = True 
