export default {
	reachableKeys,
	countPaths,
	listAcyclicPaths
};
//-------------------//
// Constants         //
//-------------------//

const reachableKeysMap = new Map([
	[0, [4, 6]],  	// From key 0, you can reach keys 4 and 6
	[1, [6, 8]],  	// From key 1, you can reach keys 6 and 8
	[2, [9, 7]],  	// From key 2, you can reach keys 9 and 7
	[3, [8, 4]],  	// From key 3, you can reach keys 8 and 4
	[4, [3, 9, 0]],	// From key 4, you can reach keys 3, 9, and 0
	[6, [1, 7, 0]],	// From key 6, you can reach keys 1, 7, and 0
	[7, [2, 6]],   	// From key 7, you can reach keys 2 and 6
	[8, [1, 3]],   	// From key 8, you can reach keys 1 and 3
	[9, [2, 4]],   	// From key 9, you can reach keys 2 and 4
]);	


//-------------------//
// Utility Functions //
//-------------------//

//TODO: P:1 Combine cyclic/acyclic DFS :ODOT//

// Helper function to traverse nodes
function traverseDFS(currentDigit, processNode, endCondition, visited = new Set(), path = []) {
    if (endCondition(currentDigit)) {
        return processNode();
    }

    let count = 0;
    let reachable = reachableKeys(currentDigit);

    for (let nextDigit of reachable) {
        if (visited.has(nextDigit)) continue;

        // Mark the node as visited for acyclic paths
        if (visited !== null) visited.add(nextDigit);

        // Add node to path for acyclic paths
        if (path !== null) path.push(nextDigit);

        // Process node and/or count results
        count += traverseDFS(nextDigit, processNode, endCondition, visited, path);

        // Backtrack for acyclic paths
        if (path !== null) path.pop();
        if (visited !== null) visited.delete(nextDigit);
    }

    return count;
}

// Recursive DFS function for cyclic paths
function cyclicDFS(currentDigit, remainingHops) {
    return traverseDFS(
        currentDigit,
        () => remainingHops === 0 ? 1 : 0,
        () => remainingHops === 0,
        null, // No visited nodes needed
        null  // No path needed
    );
}

// Recursive DFS function for acyclic paths
function asyclicDFS(currentDigit, visited, path) {
    return traverseDFS(
        currentDigit,
        () => {
            if (path.length > 1) {
                allPaths.push([...path]);
            }
            return 0; // Count not needed for acyclic paths
        },
        () => false, // No end condition, continue until all paths are explored
        visited,
        path
    );
}

// Quick Sort implementation to sort paths for acyclic path listing
function quickSort(arr, compareFn) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const middle = [];

    for (const element of arr) {
        if (compareFn(element, pivot) < 0) {
            left.push(element);
        } else if (compareFn(element, pivot) > 0) {
            right.push(element);
        } else {
            middle.push(element);
        }
    }

    return [...quickSort(left, compareFn), ...middle, ...quickSort(right, compareFn)];
}

// Comparator function to compare path lengths
function comparePathLength(pathA, pathB) {
    return pathA.length - pathB.length;
}

//-------------------//
// Export Functions //
//-------------------//

// Function to validate starting digit input and retrive the reachable values from the reachableKeysMap
function reachableKeys(startingDigit) {
	//Check if startingDigit is an invalid digit or 5
	if (!reachableKeysMap.has(startingDigit)){
		return [];
	}
	//return the mapped values for startingDigit
	return reachableKeysMap.get(startingDigit);
}

// Function to build a list of all acyclic paths
function listAcyclicPaths(startingDigit) {
    // Handle invalid cases
    if (!reachableKeysMap.has(startingDigit)) {
        return [];
    }

    let allPaths = [];
    asyclicDFS(startingDigit, new Set(), []);

    // Sort paths using Quick Sort based on their lengths
    return quickSort(allPaths, comparePathLength);
}

// Function to count number of total paths given a startingDigit and a hopCount 
function countPaths(startingDigit, hopCount) {
    // Handle invalid cases
    if (!reachableKeysMap.has(startingDigit) || hopCount < 0) {
        return 0;
    }
    return cyclicDFS(startingDigit, hopCount);
}
