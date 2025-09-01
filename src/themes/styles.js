import colors from './colors'
import metrics from './metrics'

const container = {
  flex: 1,
}
const contentCenter = {
  justifyContent: 'center',
}
const ItemCenter = {
  alignItems: 'center',
}
const selfCenter = {
  alignSelf: 'center',
}

export default {
  container,
  contentCenter,
  ItemCenter,
  selfCenter,
  ninety: {
    width: '90%'
  },
  section: {
    padding: metrics.base,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    ...contentCenter,
    alignItems: 'center',
  },
  shadow: {
    elevation: 10,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
  end: {
    justifyContent: 'flex-end',
  },
  start: {
    justifyContent: 'flex-start',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  error: {
    color: colors.red,
    textAlign: 'center',
  },
  bg: {
    backgroundColor: colors.lightthemeColor,
  },
  wrap: {
    flexWrap: 'wrap',
  },
}