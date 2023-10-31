import {telemetry} from '../utils/dbcon.js'

  const tester = async (minutes) => {
    console.log('tester')
  const agg = 
    [
      {
      '$match': {
       'time': {
        '$gte': new Date(new Date - 1000 * 60 * minutes) //10min)
        } 
      }},{
      '$project': {
        'usedMem': 1,
        'cpu': 1,
        'time': 1,
        'processes' : '$processes.mem'
      }},{
      '$sort': {
        'time': -1
      }}, {
        '$limit': 10
      }
    ]

    const results = await query(agg)
    console.log(results);

  }


  const getAvgMem = async (minutes) => { 
    const agg = 
    [
      {
        '$match': {
          'time': {
            '$gte': new Date(new Date() - 1000 * 60 * minutes), 
            '$lte': new Date()
          }
        }
      }, {
        '$project': {
          'date': {
            '$dateToParts': {
              'date': '$time'
            }
          }, 
          'usedMem': 1, 
          'cpu': 1, 
          'processes': 1
        }
      }, {
        '$group': {
          '_id': {
            'date': {
              'day': '$date.day', 
              'hour': '$date.hour', 
              'min': '$date.minute'
            }, 
            'usedMem': '$usedMem', 
            'cpu': '$cpu', 
            'processes': {
              'mem': '$processes.mem', 
              'cpu': '$processes.cpu'
            }
          }, 
          'avgMem': {
            '$avg': '$usedMem'
          }
        }
      },{
      '$limit': 20
      }
    ]


    const results = await query(agg)
    console.dir(results[0],{ depth: 4, colors: true });
    // console.log(results)

  }
  


const query = async (agg) => {
  const cursor = telemetry.aggregate(agg)
  return await cursor.toArray()
}
  
export {getAvgMem, tester}
// const cursor  = telemetry.aggregate(tester)
// const data = await cursor.toArray()
// console.log(data)
// for await (const doc of cursor) console.log(doc)

