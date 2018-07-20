var ps = require('ps-node')



function getPIDS(hashFile) {
	ps.lookup({
		arguments: hashFile
	}, (err, resultList) => {
		if (err) {
			console.log(err)
		}
		if (resultList) {
			var thisPid = resultList.pid
			return thisPid
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
