exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("resources")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("resources").insert([
        {
          id: 1,
          name: "computer",
          description: "A simple computer",
        },
        {
          id: 2,
          name: "conference room",
          description: "A room to have meetings in",
        },
        {
          id: 3,
          name: "microphone",
          description: "A simple microphone",
        },
        {
          id: 4,
          name: "packages",
          description: "A collection of packages to deliver",
        },
        {
          id: 5,
          name: "delivery van",
          description: "A van to store and deliver things",
        },
      ]);
    });
};
