"use client";

import { useEffect, useState } from "react";
import { ITelegramUser, IRaffle } from "@/lib";
import { Api } from "@/lib/api";
import {
  Container,
  SimpleGrid,
  Text,
  Loader,
  Center,
  Tabs,
} from "@mantine/core";
import { RaffleCard } from "@/components/RaffleCard";
import { Header } from "@/components/Header";

export default function Home() {
  const [userData, setUserData] = useState<ITelegramUser | null>(null);
  const [raffles, setRaffles] = useState<IRaffle[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = ["Активные", "Завершённые", "Участвую"];
  const [activeTab, setActiveTab] = useState<number>(0);

  const refreshData = async (telegramId: string, username?: string) => {
    try {
      setLoadingUser(true);

      const [userRes, rafflesData] = await Promise.all([
        Api.createOrGetUser({ telegramId, username }),
        Api.getRaffles(telegramId),
      ]);

      if (!userRes.success || !userRes.user) {
        throw new Error(userRes.error || "Failed to refresh user data");
      }

      setUserData(userRes.user);
      setRaffles(rafflesData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const WebApp = (await import("@twa-dev/sdk")).default;

      const rawInitData = WebApp.initData;
      const tgUser = WebApp.initDataUnsafe?.user;

      if (!rawInitData || !tgUser) {
        setError("Telegram init data not found");
        setLoadingUser(false);
        return;
      }

      const telegramId = String(tgUser.id);
      const username = tgUser.username || undefined;

      localStorage.setItem("telegramId", telegramId);

      await refreshData(telegramId, username);
    };

    init();
  }, []);

  if (loadingUser) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
        <Text ml="md">Authorizing user...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Container>
        <Text color="red" size="lg" mt="xl">
          {error}
        </Text>
      </Container>
    );
  }

  return (
    <Container style={{ overflowX: "hidden", maxWidth: "100vw" }}>
      {userData && <Header userData={userData} />}

      <Tabs
        value={tabs[activeTab]}
        onChange={(value) => {
          const index = tabs.findIndex((tab) => tab === value);
          if (index !== -1) {
            setActiveTab(index);
          }
        }}
      >
        <Tabs.List justify="space-between">
          {tabs.map((tab, idx) => (
            <Tabs.Tab value={tab} key={idx}>
              {tab}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="Активные" pt="md">
          {raffles.filter((raffle) => !raffle.isFinished).length === 0 ? (
            <Text ta="center" c="dimmed" mt="md">
              Нет активных розыгрышей
            </Text>
          ) : (
            <SimpleGrid cols={1} spacing="lg">
              {raffles
                .filter((raffle) => !raffle.isFinished)
                .map((raffle, idx) => (
                  <RaffleCard
                    key={idx}
                    raffle={raffle}
                    onJoined={() => refreshData(userData?.telegramId as string)}
                  />
                ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="Завершённые" pt="md">
          {raffles.filter((raffle) => raffle.isFinished).length === 0 ? (
            <Text ta="center" c="dimmed" mt="md">
              Нет завершённых розыгрышей
            </Text>
          ) : (
            <SimpleGrid cols={1} spacing="lg">
              {raffles
                .filter((raffle) => raffle.isFinished)
                .map((raffle, idx) => (
                  <RaffleCard key={idx} raffle={raffle} />
                ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="Участвую" pt="md">
          {raffles.filter((raffle) => raffle.userTickets > 0).length === 0 ? (
            <Text ta="center" c="dimmed" mt="md">
              Вы пока не участвуете ни в одном розыгрыше
            </Text>
          ) : (
            <SimpleGrid cols={1} spacing="lg">
              {raffles
                .filter((raffle) => raffle.userTickets > 0)
                .map((raffle, idx) => (
                  <RaffleCard
                    key={idx}
                    raffle={raffle}
                    onJoined={() => refreshData(userData?.telegramId as string)}
                  />
                ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
