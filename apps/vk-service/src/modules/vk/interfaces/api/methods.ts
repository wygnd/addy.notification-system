export type VkApiMethods = VkApiGroupsMethods | VkApiMessagesMethods;

type VkApiGroupsMethods = 'groups.getMembers';
type VkApiMessagesMethods = 'messages.isMessagesFromGroupAllowed' | 'messages.send';