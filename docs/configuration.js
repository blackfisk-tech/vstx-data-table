export default {
  configuration: {
    payload: {
      documentation: {
          "collapsePages": "Hide pagination when records less than half of a default page",
          "isRanked": "Show or Hide Record Ranks",
          "table": {
            "bordered": "Allows a border to be visible",
            "striped": "Allows alternative striped rows",
            "cellbordered": "Allows each cell to be bordered",
            "overflow": "Hides cells if the Table overflows it's container",
            "hoverable": "Allows mouse hovering on rows",
            "fullwidth": "Allows the table to be forced full-width",
            "filename": "Override the default filename of the CSV Exporting",
            "isSelectable": "Enables a checkbox for selecting the row"
          },
          "settings": {
            "isVisible": "Show or Hide the Settings",
            "isAllowed": "Allow settings to be controlled or configured",
            "offset": "Default Offset"
          },
          "sortIndicator": {
            "isVisible": "Show or Hide the Sort Indicator",
            "isAllowed": "Allow sorting"
          },
          "filter": {
            "isVisible": "Show or Hide the Filter Options",
            "isAllowed": "Allow filtering",
            "isEvent": "Emit an event on filtering"
          },
          "columns": {
            "isVisible": "Show or Hide the Column Options",
            "isAllowed": "Allow column configuration"
          },
          "pagination": {
            "rowsPerPage": "Rows per Page",
            "isAllowed": "Allow pagination",
            "isVisible": "Show or Hide pagination"
          },
          "orderBy": {
            "isVisible": "Show or Hide Order By",
            "isAllowed": "Allow Order By configuration option"
          },
          "totals": {
            "isVisible": {
              "all": "Allow data set totals only",
              "page": "Allow page totals only",
              "count": "Allow counts"
            },
            "isAllowed": "Show or Hide Totals"
          }
      }
      ,
      example: `
        {
         "collapsePages": Boolean,
         "isRanked": Boolean,
         "table": {
           "bordered": Boolean,
           "striped": Boolean,
           "cellbordered": Boolean,
           "overflow": Boolean,
           "hoverable": Boolean,
           "fullwidth": Boolean,
           "filename": String,
           "isSelectable": Boolean
         },
         "settings": {
           "isVisible": Boolean,
           "isAllowed": Boolean,
           "offset": Number
         },
         "sortIndicator": {
           "isVisible": Boolean,
           "isAllowed": Boolean
         },
         "filter": {
           "isVisible": Boolean,
           "isAllowed": Boolean,
           "isEvent": Boolean
         },
         "columns": {
           "isVisible": Boolean,
           "isAllowed": Boolean
         },
         "pagination": {
           "rowsPerPage": Number,
           "isAllowed": Boolean,
           "isVisible": Boolean
         },
         "orderBy": {
           "isVisible": Boolean,
           "isAllowed": Boolean
         },
         "totals": {
           "isVisible": {
             "all": Boolean,
             "page": Boolean,
             "count": Boolean
           },
           "isAllowed": Boolean
         }
        }
      `
    },
    columns: {
      documentation: {
        "Array of Columns": {
          "Column": {
            "Name": "Column Title",
            "Format": "Name of filter for formatting.",
            "Field": "Key Name in Payload",
            "Align": "Alignment (left, right, centered)",
            "Position": "Numeric position of Column Display",
            "IsVisible": "Show/Hide Column",
            "Sort": {
              "IsSortable": "Allow Sorting",
              "Direction": "Sort Direction (asc, desc)",
              "Order": "Sort Order"
            }
          }
        }
      },
      example: `
        {
          "name": String,
          "format": String,
          "field": String,
          "align": String,
          "position": Number,
          "isVisible": Boolean,
          "sort": {
            "isSortable": Boolean,
            "direction": String,
            "order": Number
          }
        }
      `
    },
  },
}