exports.up = function (knex) {
  return knex.schema
    .createTable("projects", (tbl) => {
      tbl.increments();
      tbl.string("name").notNullable();
      tbl.string("description");
      tbl.boolean("completed").default(false);
      tbl.timestamps(true, true);
    })
    .createTable("resources", (tbl) => {
      tbl.increments();
      tbl.string("name").notNullable().unique();
      tbl.string("description");
      tbl.timestamps(true, true);
    })
    .createTable("tasks", (tbl) => {
      tbl.increments();
      tbl.string("description").notNullable();
      tbl.string("notes");
      tbl.boolean("completed").default(false);
      tbl
        .integer("project_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("projects")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.timestamps(true, true);
    })
    .createTable("resource_project", (tbl) => {
      tbl.increments();
      tbl.integer("project_id").unsigned().notNullable();
      tbl.integer("resource_id").unsigned().notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("tasks")
    .dropTableIfExists("resources")
    .dropTableIfExists("projects")
    .dropTableIfExists("resource_project");
};
