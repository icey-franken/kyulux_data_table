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

The objective of this project was to build an interactive, dynamic table using data sourced from the Center for Food Safety and Applied Nutrition Adverse Event Reporting System (CAERS). Provided via openFDA, this data set includes information on adverse events and product complaint reports submitted to FDA for foods, dietary supplements, and cosmetics. More information about the API itself can be found [here](https://open.fda.gov/apis/food/event/).

## Main Features

A variety of features were provided to maximize table functionality. Features include:
* dynamic single-column filtering via keyword search (located below each column heading) 
* dynamic dataset filtering via keyword search (located at top of page)
* single-column sorting via clicking column header
* multi-column sorting via holding shift while clicking column headers
* column reordering via dragging column header to desired location
* column resizing via clicking and dragging tab on right side of column header
* table pagination

## Technologies Used

This application was built with [React](https://github.com/facebook/react) (v17) as its front-end framework via [create-react-app](https://github.com/facebook/create-react-app) (v4).

The table itself was constructed with [react-table](https://github.com/tannerlinsley/react-table) (v7) and integrated with [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) (v13) for drag-and-drop functionality. 

