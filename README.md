# Kyulux Data Table

## Installation

1. Clone the repository onto your machine

```bash
git clone https://github.com/icey-franken/kyulux_data_table.git
```

2. CD into project directory

```bash
cd kyulux_data_table
```

3. Install project packages

```bash
npm install
```

4. Start the app

```bash
npm start
```

## Objective

The objective of this project was to build an interactive, dynamic table using data sourced from the Center for Food Safety and Applied Nutrition Adverse Event Reporting System (CAERS). Provided via openFDA, this data set includes information on adverse events and product complaint reports submitted to FDA for foods, dietary supplements, and cosmetics. More information about the API itself can be found here[https://open.fda.gov/apis/food/event/].

## Main Features

A variety of features were provided to maximize table functionality. Features include:
* dynamic single-column filtering via simple keyword search present below each column heading 
* dynamic dataset filtering via keyword search at top of page
* single-column sorting via clicking header
* multi-column sorting via holding shift while clicking column headers
* column reordering via dragging column header to desired location
* column resizing via clicking and dragging tab on right side of column header
* table pagination

## Methods



## Technical Details

### Technologies Used

This application was built with React (v17) as its front-end framework via (create-react-app (v4))[https://github.com/facebook/create-react-app]. 

The table itself was constructed with (react-table (v7))[https://github.com/tannerlinsley/react-table] and integrated with (react-beautiful-dnd (v13))[https://github.com/atlassian/react-beautiful-dnd] for drag-and-drop functionality. 


## Future Considerations

Hindsight is always 20-20. If I could do this again I would likely construct the table using react-virtualized instead of react-table due to it's increased performance with large datasets. 
