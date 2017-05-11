# Admin Forntend Design
## 1. Api Client and Store

### 1.1. Component-Specific Api Client and Store
To make each component self-contained, we put the backend api calls and stores within each component's folder. It has two advantages compared with centralized api calls and centralized stores: 

* Almost all files of a component are in a same place. The only exception is that the module store needs to be registered in one root store. 
* The data models can be shared easily with a short import path and are easy to maitain.  

### 1.2. Api Client Result
There are three possible results for any Api calls: 
* undefined: the async calls are in progress and the corresponding store value is undefined. 
* error: the call fails with an error.
* data: the call succeed. 

To provide a good user experience, we have the following process:
* The value is `undefined` until an api call returns. The component flag could be `isLoading` for data fetch or `isProcessing` for update/delete. 
* The return value has two fields: an `error` field and a `data field`. We use `fetchError`, `{operation}Error` if there is an error for data fetch or other operations. 

The component UI has three views, each for one of the three possible values: work in progress view, error view and normal view. A normal view is only shown when a call returns without an error. 

## 2. Category

First, load categories. If empty, show "There are no categories" and an "add category" button. Else, show the category tree. 

There is an "add category" button above the category tree to add a root-level category at any time. If a category has one or more categories, there is a folder flag showing its status: either folded or unfolded. 

There is a order number for each category showing its position among its siblings, changing the order number changes its order among its siblings. 

Clicking a category will bring up a category view allowings a user to edit a category, add a sub category or delete a category. There is a "Back to Categories" link to go back to the category tree view. 

When a sub category is created, show a category view for the newly created category. 

When a category is edited, show a category view with a success/error message. When a category is deleted, show the delete action status with a "Back to Categories" link. 


