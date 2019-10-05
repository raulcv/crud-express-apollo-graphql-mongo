import mongoose from 'mongoose';
import { database } from './key';

const conexion = async () => {
    await mongoose.connect(database.DBCON, {
        useNewUrlParser: true
    });
}
conexion();
/*
mongoose.connect(database.DBCON, {
    useNewUrlParser: true //Puede que esto no sea cesesario despues, es solo bug de mongo
})
    .then(db => console.log('DB conectado'))
    .catch(err => console.log(err));*/