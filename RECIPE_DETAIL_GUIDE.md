# 🍳 Recipe Detail Feature - Implementation Guide

## ✅ What's Been Built

### Backend Changes
1. **New Database Table**: `recipe_tools` 
   - Stores cooking tools/equipment for each recipe
   - Fields: `id`, `recipe_id`, `tool_name`, `description`, `timestamps`

2. **New Model**: `RecipeTool`
   - Located: `app/Models/RecipeTool.php`
   - Relationship: `belongsTo Recipe`

3. **Updated Recipe Model**
   - Added `tools()` method returning `HasMany RecipeTool`

4. **Enhanced API Endpoint**: `GET /api/recipes/{id}`
   - Now returns complete recipe details with:
     - **Ingredients**: `ingredient_name`, `quantity`, `price_estimate`
     - **Tools**: `tool_name`, `description`
     - **Steps**: `stepNumber`, `description`

### Frontend Changes

**Fetching Architecture** (No more hardcoded data):

1. **Recipe Detail Page** (`detail_resep.tsx`)
   - Fetches full recipe data from `/api/recipes/{id}`
   - Displays name, image, price, cooking time
   - Shows 3 tabs: Ingredients, Tools, Steps

2. **Ingredients Page** (`bahan_page.tsx`)
   - Fetches ingredient details from API
   - Shows quantity and price for each ingredient
   - Displays in formatted list with checkmarks

3. **Tools Page** (`alat_page.tsx`)
   - Fetches tools data from API
   - Shows tool names with optional descriptions
   - Displays in formatted list with checkmarks

4. **Updated Navigation**
   - `(tabs)/index.tsx` (Homepage) → passes recipe ID
   - `(tabs)/explore.tsx` (Explore/Masak & Order) → passes recipe ID
   - `list.tsx` (List) → passes recipe ID

---

## 🚀 Next Steps to Deploy

### Step 1: Run Database Migration
```bash
cd Backend/backend_QuickMeal
php artisan migrate
```

### Step 2: Seed Sample Data (includes recipe tools)
```bash
php artisan db:seed
# Or specific seeder:
php artisan db:seed --class=RecipeToolSeeder
```

### Step 3: Manual Frontend Fix
Edit `Frontend/frontend_QuickMeal/app/alat_page.tsx` around line 183:

Find:
```typescript
  itemText: { 
    fontSize: 15, 
    color: '#333',
    fontWeight: '500'
  }
});
```

Replace with:
```typescript
  itemText: { 
    fontSize: 15, 
    color: '#333',
    fontWeight: '500'
  },
  descriptionText: { 
    fontSize: 12, 
    color: '#9E5F3B', 
    marginTop: 4, 
    fontWeight: '400' 
  }
});
```

### Step 4: Test the Feature

**On Web (localhost)**:
1. Go to homepage → click "Lihat Detail" on any recipe
2. Should see recipe details with Ingredients and Tools buttons
3. Click buttons to view fetched data

**On Mobile (Expo Go)**:
1. Same as above - now with proper API fetching
2. Should work because all pages use dynamic host detection

---

## 📋 API Response Example

**Request**: `GET /api/recipes/1`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Nasi Goreng",
    "subtitle": "Santapan yang selalu dirindukan",
    "image": "https://...",
    "cookingTime": 18,
    "difficulty": "Mudah",
    "totalIngredientPrice": 25000,
    "ingredients": [
      {
        "id": "1",
        "ingredient_id": "5",
        "ingredient_name": "Beras",
        "quantity": "2 piring",
        "price_estimate": 8000
      }
    ],
    "tools": [
      {
        "id": "1",
        "tool_name": "Wajan",
        "description": "Untuk menumis dan menggoreng"
      }
    ],
    "steps": [
      {
        "id": "1",
        "stepNumber": 1,
        "description": "Siapkan semua bahan..."
      }
    ]
  }
}
```

---

## 📁 Files Modified/Created

### Backend
- ✅ Created: `database/migrations/2026_05_13_000000_create_recipe_tools_table.php`
- ✅ Created: `app/Models/RecipeTool.php`
- ✅ Created: `database/seeders/RecipeToolSeeder.php`
- ✅ Updated: `app/Models/Recipe.php` (added `tools()` relation)
- ✅ Updated: `app/Http/Controllers/RecipeController.php` (enhanced `show()` method)
- ✅ Updated: `database/seeders/DatabaseSeeder.php` (added RecipeToolSeeder call)

### Frontend
- ✅ Updated: `app/detail_resep.tsx` (complete rewrite with API fetching)
- ✅ Updated: `app/bahan_page.tsx` (API fetching + dynamic loading)
- ✅ Updated: `app/alat_page.tsx` (API fetching + dynamic loading)
- ✅ Updated: `app/(tabs)/index.tsx` (pass recipe ID)
- ✅ Updated: `app/(tabs)/explore.tsx` (pass recipe ID)
- ✅ Updated: `app/list.tsx` (pass recipe ID)

---

## 🔄 Data Flow Diagram

```
Recipe List Page
  ↓
  └─→ Click "Detail/Resep"
        ↓
        └─→ detail_resep.tsx receives {id, name, ...}
              ↓
              └─→ Fetch GET /api/recipes/{id}
                    ↓
                    └─→ Display Recipe with 3 buttons:
                        ├─ Ingredients → bahan_page.tsx (fetches from same API)
                        ├─ Tools → alat_page.tsx (fetches from same API)
                        └─ Steps (displayed inline)
```

---

## 🎯 Future Enhancements

1. **Recipe Recommendations**: Once recommendation form is built, use same detail page
2. **Add/Edit Tools**: Admin panel to manage recipe tools
3. **Tool Images**: Add icon URLs for better UX
4. **Video Steps**: Replace text steps with video tutorials
5. **Nutrition Info**: Add nutritional data per ingredient

---

## ⚠️ Troubleshooting

**Issue**: Tools showing "Tidak ada alat tersedia"
- **Solution**: Make sure `php artisan migrate` ran successfully and seeder was executed

**Issue**: Blank ingredient prices
- **Solution**: Check RecipeIngredientSeeder has price_estimate values

**Issue**: API returning 404
- **Solution**: Verify recipe ID is being passed correctly in navigation params

