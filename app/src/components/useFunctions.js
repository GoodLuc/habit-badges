export function gradeByCount(count) {
		const grades = [
			[ 'grade1', 'Morning grade' ],
			[ 'grade3', 'Azure grade' ],
			[ 'grade2', 'Gold grade' ],
			[ 'grade4', 'Rise grade' ],
			[ 'grade5', 'Pacific grade' ]
		]
		if (count < 10) { return grades[0] } 
		else if (count >= 10 && count < 30) { return grades[1] }
		else if (count >= 30 && count < 60) { return grades[2] }
		else if (count >= 60 && count < 120) { return grades[3] }
		else if (count >= 120) { return grades[4] }
}
