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
import { showNotification } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface IRaffleCard {
  raffle: IRaffle;
  onJoined?: () => void;
}

export const RaffleCard: React.FC<IRaffleCard> = ({ raffle, onJoined }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);

    const telegramId = localStorage.getItem("telegramId") || "";

    if (!telegramId) {
      setLoading(false);
      return;
    }

    const result = await Api.joinRaffle({
      raffleId: raffle.id,
      telegramId,
      tickets: ticketCount,
    });

    setLoading(false);

    if ("error" in result) {
      showNotification({
        title: "Ошибка",
        message: result.error,
        color: "red",
      });
    } else {
      showNotification({
        title: "Успех",
        message: "Вы успешно зарегистрировались в раффле!",
        color: "teal",
        position: "top-center",
        autoClose: 3000,
      });

      close();
      if (onJoined) onJoined();
    }
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
        <Text size="sm" c="dimmed">
          Ваши билеты: {raffle.userTickets}
        </Text>
        <Text size="sm" c="dimmed">
          Всего билетов: {raffle.totalTickets}
        </Text>
        <Text size="sm" c="dimmed">
          Участники: {raffle.participants}
        </Text>

        {!raffle.isFinished ? (
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={open}
            disabled={loading}
          >
            Принять участие
          </Button>
        ) : (
          <Text c="dimmed" fw={500} mt="md" ta="center">
            Розыгрыш завершён
          </Text>
        )}
      </Card>

      <Modal opened={opened} onClose={close} title={`${raffle.title}`} centered>
        <Stack>
          <NumberInput
            label="Количество билетов"
            value={ticketCount}
            onChange={(val) => setTicketCount(Number(val))}
            min={1}
          />

          <Button fullWidth onClick={handleJoin} loading={loading}>
            Ввести
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
