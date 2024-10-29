

import admin from 'firebase-admin'
import serviceAccount from '../../final-project-1b8b6-firebase-adminsdk-ygxud-1484d01997.json' assert { type: 'json' };
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'final-project-1b8b6.appspot.com'


});

const bucket = admin.storage().bucket();

export async function uploadImage(req, res) {
    let file_path = req.file.path
    let file_destination = `${Date.now()}_${req.file.originalname}}`
    try {
        let result = await bucket.upload(file_path, {
            file_destination,
            gzip: true,
            metadata: {
                cacheControl: 'public,max-age=31536000',
            },
        })

        let name = result[0].metadata.name
        console.log(file_destination)
        const file = await bucket.file(name);
        const [exists] = await file.exists();

        if (!exists) {
            return res.status(404).send({ message: 'Image not found' });
        }

        const options = {
            version: 'v2',
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000,
        };

        const [url] = await file.getSignedUrl(options);
        res.status(200).send({ url });
    }
    catch (err) { console.log(err); res.status(500).send("err") }

}


export async function getImageByName(req, res) {
    const { filename } = req.params;
    const filePath = `${filename}`;
    console.log(filePath)
    try {
        const file = await bucket.file(filePath);
        const [exists] = await file.exists();
        console.log(file)

        if (!exists) {
            return res.status(404).send({ message: 'Image not found' });
        }

        const options = {
            version: 'v2',
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000,
        };

        const [url] = await file.getSignedUrl(options);
        res.status(200).send({ url });
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving image', error });
    }
}