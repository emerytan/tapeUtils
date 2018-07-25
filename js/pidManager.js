var ps = require('ps-node')



function getPIDS() {
	ps.lookup({
		arguments: 'find'
	}, (err, resultsList) => {
		if (err) {
			console.log(err)
		}
		if (resultsList) {
			var thisPID = resultsList[0]
			return thisPID
		}
	})
}


function killPIDS() {
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

module.exports.getPIDS = getPIDS
module.exports.killPIDS = killPIDS
