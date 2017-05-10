# Admin UI Design

## Category

First, load categories. If empty, show "There are no categories" and an "add category" button. Else, show the category tree. 

There is an "add category" button above the category tree to add a root-level category at any time. If a category has one or more categories, there is a folder flag showing its status: either folded or unfolded. 

There is a order number for each category showing its position among its siblings, changing the order number changes its order among its siblings. 

Clicking a category will bring up a category view allowings a user to edit a category, add a sub category or delete a category. There is a "Back to Categories" link to go back to the category tree view. 

When a sub category is created, show a category view for the newly created category. 

When a category is edited, show a category view with a success/error message. When a category is deleted, show the delete action status with a "Back to Categories" link. 