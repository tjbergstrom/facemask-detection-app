// process.js


async function getPoses(videoElement, net) {
    return await net.estimateMultiplePoses(
        videoElement, 1.0, false, 16, 8, 0.5, 20
    );
}


function getFaces(poses) {
    let coordinates = [];
    for (let i = 0; i < poses.length; i++) {
        bounds = new Object();
        let kp = poses[i].keypoints;
        bounds.upperLeftX = kp[4].position.x;
        bounds.width = kp[3].position.x - kp[4].position.x;
        if (bounds.width >= 48) {
            bounds.upperLeftY = kp[4].position.y - 0.75 * bounds.width;
            bounds.height = bounds.width * 1.5;
            coordinates.push(bounds);
        }
    }
    return coordinates;
}


async function getMaskProbabilities(classifier, faces, videoElement) {
    let probs = new Array(faces.length).fill(0);
    let image = await tf.browser.fromPixels(videoElement);
    image = tf.reshape(image, [1].concat(image.shape));
    image = image.div(255.0);
    const cropSize = [48, 48];
    for (let i = 0; i < faces.length; i++) {
        let box = tf.tensor([[
            faces[i].upperLeftY / image.shape[1],
            faces[i].upperLeftX / image.shape[2],
            (faces[i].upperLeftY + faces[i].height) / image.shape[1],
            (faces[i].upperLeftX + faces[i].width) / image.shape[2]
        ]]);
        let cropped = tf.image.cropAndResize(image, box, [0], cropSize, 'nearest');
        probs[i] = classifier.predict(cropped).dataSync()[0];
    }
    tf.dispose(image);
    return probs;
}


function avgProbs(probs) {
    if (probs.length > 0) {
        return probs.reduce((a,b) => a + b) / probs.length;
    }
}


function threshProbs(probs, threshold) {
    return probs.map(p => (p < threshold) ? 0 : 1);
}



//
