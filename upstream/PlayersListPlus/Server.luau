local module = {}

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Module = ReplicatedStorage.PlayersListPlus
local PlayersListPlus = require(Module)
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

local events = {
	["Kick"] = function(Player, PlayerToKick)
		local hasPermission = GetPermissions.HasPlayerPermission(Player, "Kick")
		
		if not hasPermission then
			return
		end
		
		PlayerToKick:Kick()
	end,
	["getUserYouCanChatWith"] = PlayersListPlus.Config.ShowPlayerCanTalkWith and function(Player)
		Remote:FireClient(Player, "PlayersYouCanChatWith", getUsersYouCanChatWith(Player))
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
					
					events.getUserYouCanChatWith(player)
				end
				
			end)
			
		end)
		
	end
end

return module
