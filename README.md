# @rbxts/playerslistplus

[roblox-ts](https://roblox-ts.com) package for **PlayersListPlus**, the custom Roblox players list by
**MiniDev** ([@MiniDevFR](https://www.roblox.com/users/374169534/profile)): leaderstats columns with
icons and colors, abbreviated numbers (1.56Qd), sorting by a stat, teams, a menu on each player
(Add Friend, Block, Examine Avatar), tags, custom icons and animated names.

The Luau code in `lib/PlayersListPlus` is PlayersListPlus v1.19.0, taken from MiniDev's
[Creator Store model](https://create.roblox.com/store/asset/17536788325) (updated 2026-04-27), with the
few changes listed below; the first commit of this repository is the model's code untouched. This
package adds `lib/PlayersListPlus/index.d.ts` and a `package.json`, so the list installs with npm and is
typed in roblox-ts. All credit for the players list goes to MiniDev: see the
[DevForum post](https://devforum.roblox.com/t/playerslistplus-v1-better-custom-players-list/2975158).

## Install

```sh
npm install github:MysticSaba-max/rbxts-playerslistplus
```

It lands in `node_modules/@rbxts/playerslistplus`, which the usual roblox-ts Rojo project already syncs.

## Use

```ts
// Client (a LocalScript, once).
import PlayersListPlus from "@rbxts/playerslistplus";

PlayersListPlus.init({
	leaderstats: [
		{ Name: "Coins", Icon: "rbxassetid://17536803725", Color: Color3.fromRGB(255, 170, 0) },
		{ Name: "Rebirths", Icon: "rbxassetid://17536798171", Color: Color3.fromRGB(255, 85, 127) },
	],
	SortByLeaderstats: "Coins",
	CustomSelectionsButtons: [], // no Kick button
	ShowPlayerCanTalkWith: false,
});

PlayersListPlus.Close?.(); // and Open?.(), IsOpen?.()
PlayersListPlus.SetTopOffset(80); // under your own HUD at the top right
```

```ts
// Server, only for the Kick button or the 🔊: the same config as the clients'.
PlayersListPlus.initServer({ ShowPlayerCanTalkWith: true });
```

Each player's values come from their `leaderstats` folder, as with Roblox's list: create it on the
server as usual. Roblox's own list is hidden by `init`; Tab opens and closes this one. A key given to
`init` replaces the default's whole value (`leaderstats`, `CustomSelectionsButtons`, …); the defaults
are the `Config` table at the top of `lib/PlayersListPlus/init.luau`.

Server side, the original API is there too: `AddCustomIconPlayer`, `ChangeColorPlayer`,
`AddAnimationPlayer` and `AddTagPlayer`, see the comment at the top of `init.luau`.

## Changes from the original

Every change is marked `(package)` in the code.

- **A package, not three scripts**: the ModuleScript no longer has to be `ReplicatedStorage.PlayersListPlus`
  (its modules find each other by `script`), the setup Script's `Server` module is now
  `lib/PlayersListPlus/Server.luau`, started by `initServer`, and the LocalScript's job is `init`.
- **Config through `init(config)` and `initServer(config)`**, instead of editing the file: the column
  sizes are computed again from it, and a `MenuFont` given is applied.
- **`StartOpen`** (default `true`): `false` starts the list closed. `Open`, `Close` and `IsOpen` are
  exported after `init`.
- **Size and place**: `RowRatio` (the original divides the rows' height by the columns' ratio, so rows get
  small past 2 columns; `1.5` keeps 2 columns' rows), `Scale` (a `UIScale` from the top right corner) and
  `TopOffset` / `SetTopOffset(px)` (moves the list down, for your own HUD above it).
- **Fixes**:
  - the Kick remote only kicks a `Player` of this server (the client chooses that argument);
  - the 🔊 list costs one `CanUsersChatAsync` call per player in the server: a client may ask for it at
    most every 5 s, and the client only asks when `ShowPlayerCanTalkWith` is on;
  - Block / Unblock looked up your own user id in your blocked list instead of the selected player's.

## Updating from the original

Insert the new model in Studio, save it as `.rbxm`, and extract its scripts and instances (the first
commit was made with [Lune](https://lune-org.github.io/docs): `deserializeModel`, each `Source` to a
`.luau` file, `Assets` and the gradients to `.rbxm`). Apply the `(package)` changes again, check
`index.d.ts` against the new `Config` and functions, and bump `version` to the model's `Config.VERSION`.

## License

See [LICENSE.md](LICENSE.md).
