module.exports = {
    apps: [
      {
        name: "nestjs-udemy",
        script: "npm",
        args: "run start:dev",
        watch: true,
        ignore_watch: ["node_modules", "logs"],
        env: {
          NODE_ENV: "development",
        },
      },
    ],
  };
  