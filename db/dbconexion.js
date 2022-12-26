import mongoose from 'mongoose';
import { database } from './key';

const mongoDBConnection = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(database.DBCON, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((connected) => {
            console.log('🎉 connected to database successfully')
            resolve(connected);
        }).catch((error) => {
            console.log('Database connection: Something went wrong: ')
            reject(error);
        });
    })
}
// conexion();
/*
mongoose.connect(database.DBCON, {
    useNewUrlParser: true //Puede que esto no sea cesesario despues, es solo bug de mongo
})
    .then(db => console.log('DB conectado'))
    .catch(err => console.log(err));*/

export default mongoDBConnection