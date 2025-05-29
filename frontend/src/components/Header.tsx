import { ITelegramUser } from "@/lib";
import { Avatar, Text, Container, Box } from "@mantine/core";

interface IHeader {
  userData: ITelegramUser;
}

export const Header: React.FC<IHeader> = ({ userData }) => {
  return (
    <Box
      style={{
        position: "relative",
        padding: "16px",
        marginBottom: "16px",
        borderBottom: "3px solid transparent",
      }}
    >
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 600,
          margin: "0 auto",
          gap: 60,
        }}
      >
        {userData.photo_url ? (
          <Avatar src={userData.photo_url} radius="xl" size={40} />
        ) : (
          <Avatar radius="xl" size={40}>
            {userData.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
        )}

        <Text size="lg" style={{ minWidth: 100 }}>
          @{userData.username || "User"}
        </Text>

        <Text color="violet" size="sm" style={{ minWidth: 100 }}>
          🎫 {userData.ticketBalance ?? 0}
        </Text>
      </Container>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 3,
          background: "linear-gradient(90deg, #2C2E33, #7C4DFF, #2C2E33)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};
