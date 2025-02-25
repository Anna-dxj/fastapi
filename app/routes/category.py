from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session 
from app.models import Category as CategoryModel, Product as ProductModel
from app.schemas import Category, CategoryCreate, CategoryUpdate, Product
from typing import Optional
from app.db import get_session_local

router = APIRouter()

@router.get('/', response_model=list[Category])
def get_categories_route(limit: int=10, offset: int=0,  db: Session = Depends(get_session_local)):
   if limit == 0: 
        return db.query(CategoryModel).all()
   else: 
        return db.query(CategoryModel).limit(limit).offset(offset).all()

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
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail=f'Category {category_id} not found')
    
    return category.products

# update categories
@router.put('/update/{category_id}')
def update_category(category_id: int, category_update: CategoryUpdate, db: Session = Depends(get_session_local)):
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not category: 
        raise HTTPException(status_code=404, detail=f'category {category_id} not found')
    
    category.name = category_update.name 

    try:
        db.commit()
        db.refresh(category)
        return category
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f'Database error: {str(e)}')

# delete categories
@router.delete('/delete/{category_id}', status_code =status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db:Session = Depends(get_session_local)):
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not category: 
        raise HTTPException(status_code=404, detail=f'Category {category_id} not found')
    
    try:
        db.delete(category)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f'Database error: {str(e)}')