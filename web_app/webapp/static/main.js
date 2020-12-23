// main.js
// Main loop for receiving input frames and outputting them


(function () {

    function clearCanvasPlayer(context, canvasPlayer) {
        context.clearRect(0, 0, canvasPlayer.width, canvasPlayer.height);
    }

    function drawVideoFrame(context, vid) {
        context.drawImage(vid, 0, 0, vid.offsetWidth, vid.offsetHeight);
    }

    function drawBoundRectangles(context, faces, probs) {
        faces.forEach((face, index) => {
            context.beginPath();
            context.rect(face.upperLeftX, face.upperLeftY, face.width, face.height);
            context.stroke();
            context.lineWidth = "3";
            context.font = "24px Arial";
            let text;
            if (probs[index] >= 0.50000000) {
                text = `Mask: ${(probs[index] * 100).toFixed(1)}%`;
                context.strokeStyle = "green";
            }
            else {
                text = `Without Mask: ${((1.0 - probs[index]) * 100).toFixed(1)}%`;
                context.strokeStyle = "red";
            }
            context.strokeText(text, face.upperLeftX, face.upperLeftY - 10);
        });
    }

    function updateCurrentAvg(th, probs) {
        let newCurrentAvg = avgProbs(threshProbs(probs, 0.5));
        th.cells[1].innerText = `${(newCurrentAvg * 100).toFixed(1)}%`;
    }

    function updateNumPeople(th, probs) {
        th.cells[1].innerText = `${probs.length}`;
    }

    function updateStatsTable(table, probs) {
        const tableCurrentAvg = document.getElementById("currentAvg");
        const tableNumPeople = document.getElementById("numPeople");
        if (probs.length > 0) {
            updateCurrentAvg(tableCurrentAvg, probs);
        }
        updateNumPeople(tableNumPeople, probs);
    }

    function processLoop(poseDetector, maskClassifier, canvasPlayer, canvasContext, videoPlayer) {
        if (self.poseDetector && self.maskClassifier) {
            getPoses(videoPlayer, poseDetector)
            .then(result => {
                result = result.filter(pose => (pose.score >= 0.1));
                let faces = getFaces(result);
                tf.dispose(result);
                tf.engine().startScope()
                getMaskProbabilities(maskClassifier, faces, videoPlayer)
                .then(results => {
                    tf.engine().endScope()
                    clearCanvasPlayer(ctx, canvasPlayer);
                    drawBoundRectangles(ctx, faces, results);
                    updateStatsTable(table, results);
                    tf.dispose(results);
                }).catch((err) => {console.log(err);});
            }).catch((err) => {console.log(err);});
        }
    }

    self.table = document.querySelector("#statsTable");
    self.videoPlayer = document.querySelector("#video");
    self.canvasPlayer = document.querySelector("#canvas");
    self.ctx = canvasPlayer.getContext("2d");
    self.videoPlayer.addEventListener('loadeddata', (event) => {
        canvasPlayer.height = videoPlayer.videoHeight;
        canvasPlayer.width = videoPlayer.videoWidth;
        videoPlayer.height = videoPlayer.videoHeight;
        videoPlayer.width = videoPlayer.videoWidth;
        let refresh = 0.01;
        setInterval(() => tf.tidy(() => {
            processLoop(self.poseDetector, self.maskClassifier, self.canvasPlayer, self.ctx, self.videoPlayer);
        }), refresh*1000)
    });

    posenet.load()
    .then(pnet => self.poseDetector = pnet)
    .catch(err => console.log(err));

    tf.loadLayersModel('../static/model.json')
    .then(classifier => self.maskClassifier = classifier)
    .catch(err => console.log(err));

})();



//
