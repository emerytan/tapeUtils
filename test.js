var ps = require('ps-node')
var liveCheckProc

ps.lookup({
	arguments: '/home/emery'
}, (err, resultList) => {
	if (err) {
		console.log(err)
	}

	if (resultList) {
		console.log(resultList)
		liveCheckProc = resultList
		setTimeout(killIt, 3000);
	}
});

function killIt() {
	console.log('killIt function');
	liveCheckProc.forEach(process => {
		if (process) {
			ps.kill(process.pid, (err) => {
				if (err) {
					throw err
				} else {
					console.log(`process: ${process.pid} killed`);
				}
			})
		}
	});
}
