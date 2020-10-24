exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("tasks")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("tasks").insert([
        {
          id: 1,
          description: "turn on computer",
          notes: "make sure it can turn on",
          completed: false,
          project_id: 1,
        },
        {
          id: 2,
          description: "open file",
          notes: "open the file in powerpoint",
          completed: false,
          project_id: 1,
        },
        {
          id: 3,
          description: "present slideshow",
          notes: "dont mess up!",
          completed: false,
          project_id: 1,
        },
        {
          id: 4,
          description: "Connect the mic to the computer",
          notes: "Make sure you have the right adapter (if necessary)",
          completed: false,
          project_id: 2,
        },
        {
          id: 5,
          description: "Record your song",
          notes: "Dont be shy!",
          completed: false,
          project_id: 2,
        },
        {
          id: 6,
          description: "Put gas in car",
          notes: "bring money!",
          completed: false,
          project_id: 3,
        },
        {
          id: 7,
          description: "Deliver packages",
          notes: "double check the addresses",
          completed: false,
          project_id: 3,
        },
      ]);
    });
};
