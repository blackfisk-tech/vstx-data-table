import joi from 'joi'

export const schemas = {
  configuration: {
    schema: joi.object().keys({
      collapsePages: joi.boolean(),
      isRanked: joi.boolean(),
      columns: joi.object().keys({
        isVisible: joi.boolean(),
        isAllowed: joi.boolean()
      }),
      settings: joi.object().keys({
        overflow: joi.boolean(),
        isVisible: joi.boolean(),
        isAllowed: joi.boolean(),
        offset: joi.number().integer().min(0)
      }),
      sortIndicator: joi.object().keys({
        isVisible: joi.boolean(),
        isAllowed: joi.boolean()
      }),
      filter: joi.object().keys({
        isVisible: joi.boolean(),
        isAllowed: joi.boolean()
      }),
      pagination: joi.object().keys({
        rowsPerPage: joi.number().integer().min(10).max(100),
        isVisible: joi.boolean(),
        isAllowed: joi.boolean()
      }),
      orderBy: joi.object().keys({
        isVisible: joi.boolean(),
        isAllowed: joi.boolean()
      }),
      totals: joi.object().keys({
        isVisible: joi.object().keys({
          all: joi.boolean(),
          page: joi.boolean(),
          count: joi.boolean()
        }),
        isAllowed: joi.boolean()
      })
    }),
    options: {}
  },
  payload: {
    schema: joi.array().items(joi.object().min(1)),
    options: {}
  },
  altered: {
    schema: joi.array()
  },
  columns: {
    schema: joi.array().items(
      joi.object().keys({
        name: joi.string().min(1).required(),
        editing: joi.object().keys({
          edit: joi.boolean(),
          isAllowed: joi.boolean()
        }),
        align: joi.string().lowercase().valid(['left', 'right', 'centered']),
        field: joi.string(),
        format: joi.string(),
        hasLink: joi.boolean(),
        showLogo: joi.boolean(),
        position: joi.number().required(),
        isVisible: joi.boolean(),
        link: joi.string(),
        linkReplaceText: joi.string(),
        linkReplaceField: joi.string(),
        eventName: joi.string(),
        eventData: joi.any(),
        sort: joi.object().keys({
          isSortable: joi.boolean(),
          direction: joi.string().lowercase().allow('').valid(['asc', 'desc', '']),
          order: joi.number().min(0)
        }).and('order', 'isSortable', 'direction')
      }).and('linkReplaceText', 'linkReplaceField')
    ),
    options: {
      allowUnknown: true,
      convert: false
    }
  }
}
