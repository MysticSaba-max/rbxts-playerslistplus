// roblox-ts typings for PlayersListPlus by MiniDev (@MiniDevFR), a custom players list for Roblox:
// https://devforum.roblox.com/t/playerslistplus-v1-better-custom-players-list/2975158
// The Luau source next to this file is PlayersListPlus v1.19.0 with the changes listed in the README;
// these declarations only describe it. Every function is declared as a property, so roblox-ts calls it with
// `.`, as the Luau code expects (method syntax would compile to `:` and pass the module as the first argument).

/** One column of the list: a leaderstats value of every player, by its name. */
interface PlayersListPlusLeaderstat {
	/** The name of the value in each player's `leaderstats` folder (an IntValue, NumberValue or StringValue). */
	Name: string;
	/** The column's icon, before its name in the header: `rbxassetid://…`. */
	Icon?: string;
	/** The color of the column's name and numbers (white without one). */
	Color?: Color3;
}

/** A button of the menu that opens on a click on a player. */
interface PlayersListPlusButton {
	Name: string;
	/** `rbxassetid://…` */
	Icon: string;
	/** Runs on the client, with the player whose menu is open. */
	Func: (player: Player) => void;
	/** The permission the local player needs to see it (Config.Permissions); "" or none: everyone. */
	Permission?: string;
	/** false: not shown in your own menu. */
	ShowForYourself?: boolean;
}

/** A tag in a player's menu, under their name. */
interface PlayersListPlusTag {
	Name: string;
	Color: Color3;
	/** The name of a module in the Animations folder: "Golden", "RainbowGradient", "ShinyGradient". */
	Animation?: string;
}

/** By user id, then by group id and rank in it. */
interface PlayersListPlusByUserOrGroup<T> {
	UserIds: Record<number, T>;
	Group: Record<number, Record<number, T>>;
}

interface PlayersListPlusConfig {
	/** The columns, left to right; none shows the names only. */
	leaderstats: PlayersListPlusLeaderstat[];
	/** The column the players are sorted by, highest first; false keeps the join order. */
	SortByLeaderstats: string | false;
	/** More buttons in a player's menu (the original has a Kick button here, behind the "Kick" permission). */
	CustomSelectionsButtons: PlayersListPlusButton[];
	/** Permission names; "*" has them all. */
	Permissions: PlayersListPlusByUserOrGroup<string[]>;
	/** An icon before a player's name: `rbxassetid://…`. */
	CustomIcons: PlayersListPlusByUserOrGroup<string>;
	CustomTags: PlayersListPlusByUserOrGroup<PlayersListPlusTag>;
	MenuFont: Enum.Font;
	/** true: the list goes higher on a touch screen with Roblox's new top bar. */
	MobileInset: boolean;
	/** The height of a team's row (0.115 recommended). */
	TeamSize: number;
	/** true: a 🔊 after the players you can chat with (one server call per player in the server). */
	ShowPlayerCanTalkWith: boolean;
	/** (package) false: the list starts closed; its tab, Tab or Open() opens it. */
	StartOpen: boolean;
	/**
	 * (package) The rows' and header's heights are divided by this. Unset: by the columns' ratio (1 + 0.5 per
	 * column after the first), as the original, which makes the rows small past 2 columns; 1.5 keeps 2 columns' rows.
	 */
	RowRatio?: number;
	/** (package) A UIScale on the list, its tab and the player menu, from their top right corner (default 1). */
	Scale: number;
	/** (package) Pixels the list, its tab and the player menu go down, for your own HUD above (default 0). */
	TopOffset: number;
	readonly VERSION: number;
}

interface PlayersListPlus {
	/** The config in use: the defaults, then what init or initServer was given. */
	readonly Config: PlayersListPlusConfig;
	/** The user ids the local player can chat with (filled when ShowPlayerCanTalkWith is on). */
	readonly PlayersYouCanChatWith: number[];

	/**
	 * Client: hides Roblox's player list and shows this one in the PlayerGui. Call it once, from a
	 * LocalScript. The config replaces the defaults key by key (a key given replaces the whole value).
	 */
	init: (config?: Partial<PlayersListPlusConfig>) => void;
	/**
	 * Server: the Kick button and the 🔊. Call it once, with the same config as the clients'. Not needed
	 * when ShowPlayerCanTalkWith is false and no button uses the remote.
	 */
	initServer: (config?: Partial<PlayersListPlusConfig>) => void;

	/** (package, after init) Opens the list, as its tab or Tab does. Yields for the fade. */
	Open?: () => void;
	/** (package, after init) Closes the list. Yields for the fade. */
	Close?: () => void;
	/** (package, after init) Whether the list is open. */
	IsOpen?: () => boolean;
	/** (package) Moves the list, its tab and the player menu down by this many pixels (Config.TopOffset). */
	SetTopOffset: (offset: number) => void;

	/** An icon before the player's name. Call it on the server so everyone sees it. */
	AddCustomIconPlayer: (player: Player, icon: string) => void;
	/** The color of the player's name. Call it on the server so everyone sees it. */
	ChangeColorPlayer: (player: Player, color: Color3) => void;
	/** An animated gradient on the player's name (a module of the Animations folder). Server side. */
	AddAnimationPlayer: (player: Player, animationName: string) => void;
	/** A tag in the player's menu. On the server everyone sees it, on a client only that client. */
	AddTagPlayer: (player: Player, name: string, color: Color3, animationName?: string) => void;
	RemoveTagPlayer: (player: Player, name: string) => void;

	/** Sorts the rows again by Config.SortByLeaderstats (the list does it when that value changes). */
	SortPlayers: () => void;
	/** Rebuilds a player's row. */
	UpdatePlayer: (player: Player) => void;
}

declare const PlayersListPlus: PlayersListPlus;
export = PlayersListPlus;
