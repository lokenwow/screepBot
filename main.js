var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //variable to hold all the current harvesters
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //console.log('Harvesters: ' + harvesters.length);

    //Harvester spawn logic
    if (harvesters.length < 2) {
        if (!Game.spawns['Spawn1'].spawning) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);

            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'harvester' } });
        }
    }

    //variable to hold all the current builders
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    //console.log('Builders: ' + builders.length);

    // Builder spawn logic
    if (Object.keys(Game.constructionSites).length > 0) {
        // Check if there are any construction sites
        if (builders.length < 2) {
            if (!Game.spawns['Spawn1'].spawning) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);

                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
                    memory: { role: 'builder' },
                });
            }
        }
    }

    //variable to hold all the current upgraders
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('Upgraders: ' + upgraders.length);

    // Upgrader spawn logic
    if (upgraders.length < 2) {

        //If the spawn is not already spawning something
        if (!Game.spawns['Spawn1'].spawning) {

            // Sets the units name
            var newName = 'Upgrader' + Game.time;

            console.log('Spawning new upgrader: ' + newName);

            //spawn an upgraded with this body and the name generated above with the upgrader role in its memory.
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
                memory: { role: 'upgrader' },
            });
        }
    }

    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

}