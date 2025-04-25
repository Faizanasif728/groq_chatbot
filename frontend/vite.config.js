export default {
  server: {
    proxy: {
      "/api": "http://localhost:5000", // 👈 forwards /api calls to backend
    },
  },
};
