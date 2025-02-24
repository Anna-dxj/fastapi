from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session 
from app.models import Category as CategoryModel, Product as ProductModel
from app.schemas import Category, CategoryCreate, Product
from typing import Optional
from app.db import get_session_local

router = APIRouter()

@router.get('/', response_model=list[Category])
def get_categories_route(limit: int = 10, db: Session = Depends(get_session_local)):
    return db.query(CategoryModel).limit(limit).all()

# Add categories
@router.post('/', response_model=Category, status_code=status.HTTP_201_CREATED)
def create_product_route(category: CategoryCreate, db: Session=Depends(get_session_local)):
    new_category = CategoryModel(
        name = category.name
    )

    try:
        db.add(new_category)
        db.commit()
        db.refresh(new_category)
        return new_category
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f'Database error: {str(e)}')

# view products by category
@router.get('/{category_id}/products', response_model=list[Product])
def get_category_products(category_id: int, db: Session=Depends(get_session_local)):
    # raise exception for if no category Id
    category=db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail=f'Category {category_id} not found')

    products=db.query(ProductModel).filter(ProductModel.category_id == category_id).all()
    # raise exception if no products found
    if not products:
        raise HTTPException(status_code=404, detail=f'No products in category {category_id}')
    return products