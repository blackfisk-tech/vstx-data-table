export const defaults = {
  configuration: {
    size: 'normal',
    collapsePages: false,
    isRanked: false,
    table: {
      bordered: false,
      striped: true,
      cellbordered: false,
      overflow: false,
      hoverable: true,
      fullwidth: false,
      filename: '',
      isSelectable: false,
      hasFixedHeaders: true
    },
    settings: {
      isVisible: true,
      isAllowed: true,
      offset: 0
    },
    sortIndicator: {
      isVisible: true,
      isAllowed: true
    },
    filter: {
      isVisible: true,
      isAllowed: true,
      isEvent: false
    },
    columns: {
      isVisible: false,
      isAllowed: true
    },
    pagination: {
      rowsPerPage: 10,
      isAllowed: true,
      isVisible: true
    },
    orderBy: {
      isVisible: false,
      isAllowed: true
    },
    totals: {
      isVisible: {
        all: false,
        page: false,
        count: true
      },
      isAllowed: true
    }
  }
}
