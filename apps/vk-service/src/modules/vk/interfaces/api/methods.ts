export type VkApiMethods = VkApiGroupsMethods | VkApiMessagesMethods;

type VkApiGroupsMethods = 'groups.getMembers' | 'groups.isMember';
type VkApiMessagesMethods = 'messages.isMessagesFromGroupAllowed' | 'messages.send';