import {telemetry} from '../utils/dbcon.js'

export default async () => {
  const agg = [
    {
      '$project': {
        'date': {
          '$dateToParts': {
            'date': '$time'
          }
        }, 
        'cpu': 1, 
        'usedMem': 1
      }
    }, {
      '$group': {
        '_id': {
          'date': {
            'day': '$date.day', 
            'hour': '$date.hour', 
            'min': '$date.minute'
          }
        }, 
        'avgMem': {
          '$avg': '$usedMem'
        }
      }
    }
  ];
  

const result = await telemetry.aggregate(agg)


console.log(result)
}