exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("projects")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("projects").insert([
        {
          id: 1,
          name: "do a presentation",
          description: "present a slideshow in a conference room",
        },
        {
          id: 2,
          name: "record a song",
          description: "record a rudamentary song",
        },
        {
          id: 3,
          name: "deliver packages",
          description: "deliver packages using a van",
        },
      ]);
    });
};
