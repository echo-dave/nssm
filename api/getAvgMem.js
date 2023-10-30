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
  
//   const client = await MongoClient.connect(
    // 'mongodb+srv://aednssm:ekvTwAEtrDFxxgivbwyP8rhQj@cluster0.kz8lrxy.mongodb.net/',
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   );
const result = await telemetry.aggregate(agg)
  // const coll = db.collection('telemetry');
  // const cursor = coll.aggregate(agg);
  // const result = await cursor.toArray();
  // await client.close();



console.log(result)
}