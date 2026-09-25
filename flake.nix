{
  description = "Study Schedule — generic timetable (Svelte + Vite)";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
      ];

      perSystem =
        { pkgs, ... }:
        {
          devShells.default = pkgs.mkShellNoCC {
            packages = [
              pkgs.nodejs_24
            ];
            shellHook = ''
              echo "study-schedule · node $(node -v) · npm $(npm -v)"
              echo "  npm install && npm run dev"
            '';
          };
        };
    };
}
