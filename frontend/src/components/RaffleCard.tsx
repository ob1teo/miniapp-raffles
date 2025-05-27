import { IRaffle } from "@/lib";
import { Api } from "@/lib/api";
import {
  Card,
  Image,
  Text,
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface IRaffleCard {
  raffle: IRaffle;
}

export const RaffleCard: React.FC<IRaffleCard> = ({ raffle }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [ticketCount, setTicketCount] = useState<number>(1);

  const handleJoin = async () => {
    const userId = localStorage.getItem("telegramUserId");
    if (!userId) return alert("Пользователь не найден");

    const result = await Api.joinRaffle({
      raffleId: raffle.id,
      userId,
      tickets: ticketCount,
    });

    console.log(result);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image src={raffle.imageUrl} height={160} alt={raffle.title} />
        </Card.Section>

        <Group mt="md" mb="xs">
          <Text>{raffle.title}</Text>
        </Group>
        <Text size="sm" color="dimmed">
          Total tickets: {raffle.totalTickets}
        </Text>
        <Text size="sm" color="dimmed">
          Your tickets: {raffle.userTickets}
        </Text>
        <Text size="sm" color="dimmed">
          Participants: {raffle.participantCount}
        </Text>

        <Button
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          onClick={open}
        >
          Участвовать
        </Button>
      </Card>

      <Modal
        opened={opened}
        onClose={close}
        title={`Участие в: ${raffle.title}`}
        centered
      >
        <Stack>
          <NumberInput
            label="Количество билетов"
            value={ticketCount}
            onChange={(val) => setTicketCount(Number(val))}
            min={1}
            max={10}
          />

          <Button fullWidth onClick={handleJoin}>
            Подтвердить участие
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
