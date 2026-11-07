-- (package) The setup Script's Server module, now a child of the package: PlayersListPlus.initServer(config)
-- requires and starts it. The module is found next to it, not at ReplicatedStorage.PlayersListPlus.
local module = {}

local Module = script.Parent
local PlayersListPlus = require(Module)

-- (package) Seconds between two "getUserYouCanChatWith" a player may ask for: each one makes one
-- CanUsersChatAsync web call per player in the server, and a client can fire the remote as often as it likes.
local CHAT_LIST_COOLDOWN = 5
local lastChatList = {}
local GetPermissions = require(Module.Modules.GetPermissions)
local Remote = Module.RemoteEvent
local Players = game:GetService("Players")
local TextChatService = game:GetService("TextChatService")

function canChatWithPlayer(plr: Player, targetPlayer: Player)
	
	local canChatWith = false
	
	pcall(function()
		canChatWith = TextChatService:CanUsersChatAsync(plr.UserId, targetPlayer.UserId)
	end)

	return canChatWith
end

function getUsersYouCanChatWith(plr: Player)
	local playersYouCanChatWith = {}

	for _, targetPlr: Player in Players:GetPlayers() do
		if targetPlr ~= plr and canChatWithPlayer(plr, targetPlr) then 
			table.insert(playersYouCanChatWith, targetPlr.UserId)
		end
	end

	return playersYouCanChatWith
end

-- (package) The server's own refresh (a player joined) skips the cooldown; a client's request goes through it.
function sendChatList(plr: Player)
	Remote:FireClient(plr, "PlayersYouCanChatWith", getUsersYouCanChatWith(plr))
end

local events = {
	["Kick"] = function(Player, PlayerToKick)
		local hasPermission = GetPermissions.HasPlayerPermission(Player, "Kick")

		if not hasPermission then
			return
		end

		-- (package) The client chooses this argument: only a player in this server is kicked.
		if typeof(PlayerToKick) ~= "Instance" or not PlayerToKick:IsA("Player") or PlayerToKick.Parent ~= Players then
			return
		end

		PlayerToKick:Kick()
	end,
	["getUserYouCanChatWith"] = PlayersListPlus.Config.ShowPlayerCanTalkWith and function(Player)
		-- (package) At most once per CHAT_LIST_COOLDOWN for each player.
		local now = os.clock()
		local last = lastChatList[Player]
		if last and now - last < CHAT_LIST_COOLDOWN then
			return
		end
		lastChatList[Player] = now

		sendChatList(Player)
	end,
}

function module.init()
	Remote.OnServerEvent:Connect(function(plr, action, ...)
		local event = events[action]

		if event then
			event(plr, ...)
		end
	end)
	
	if PlayersListPlus.Config.ShowPlayerCanTalkWith == true then
		
		Players.PlayerAdded:Connect(function(newPlayer)
			
			task.delay(2.5, function()
				
				for _, player in Players:GetPlayers() do
					
					if player == newPlayer then
						continue
					end

					sendChatList(player)
				end

			end)

		end)

		Players.PlayerRemoving:Connect(function(plr)
			lastChatList[plr] = nil
		end)

	end
end

return module
